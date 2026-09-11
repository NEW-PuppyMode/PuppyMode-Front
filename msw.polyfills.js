import 'fast-text-encoding';
import 'react-native-url-polyfill/auto';

function defineMockGlobal(name) {
  if (typeof global[name] === 'undefined') {
    global[name] = class {
      constructor(type, eventInitDict) {
        this.type = type;
        Object.assign(this, eventInitDict);
      }
    };
  }
}

['MessageEvent', 'Event', 'EventTarget', 'BroadcastChannel'].forEach(
  defineMockGlobal,
);

/**
 * MSW가 가짜 응답을 돌려줄 때 `target instanceof XMLHttpRequestUpload`로 이벤트가
 * 요청 본체의 것인지 업로드의 것인지 가른다. React Native에는 이 전역이 없어
 * "Property 'XMLHttpRequestUpload' doesn't exist"로 멈춘다.
 *
 * 빈 클래스로 채우면 에러는 사라지지만 판정이 항상 false가 되어 업로드 이벤트가
 * 요청 본체 쪽 리스너로 흘러간다. RN의 xhr.upload는 XMLHttpRequestEventTarget
 * 인스턴스라, 그 생성자를 등록해야 브라우저와 같은 결과가 나온다.
 * (node_modules/react-native/Libraries/Network/XMLHttpRequest.js)
 */
if (typeof global.XMLHttpRequestUpload === 'undefined') {
  global.XMLHttpRequestUpload = new XMLHttpRequest().upload.constructor;
}

// 같은 코드가 요청 본문을 변환할 때 `body instanceof Document`도 가드 없이 쓴다.
// 이미 정의된 런타임에서는 건드리지 않는다.
defineMockGlobal('Document');

/**
 * MSW는 가짜 응답의 본문을 `response.body.getReader()`로 읽어 앱에 넘긴다.
 * 그런데 RN의 Response(whatwg-fetch)에는 `.body` 자체가 없어서, MSW가 본문을
 * 건너뛰고 "200 + 빈 본문"으로 응답을 끝낸다. 앱은 응답이 비어 있으니 인증
 * 실패로 보고 토큰까지 지운다(app/index.tsx).
 *
 * MSW가 쓰는 건 getReader().read() 뿐이라, 본문 전체를 한 번에 내주는 리더만
 * 흉내 낸다. clone()으로 읽어서 원래 응답의 본문은 소비하지 않는다.
 * 목 모드에서만 로드되는 파일이라 실제 네트워크 응답에는 영향이 없다.
 *
 * 본문은 text()로 읽는다. arrayBuffer()는 whatwg-fetch가 RN 네이티브 FileReader를
 * 거쳐 처리하는데, text()는 문자열 본문을 JS 안에서 그대로 돌려준다. 목 응답은
 * 전부 JSON 문자열이라 이걸로 충분하다. (바이너리 본문을 목킹하려면 바꿔야 한다)
 */
if (!('body' in Response.prototype)) {
  Object.defineProperty(Response.prototype, 'body', {
    configurable: true,
    get() {
      // 화살표 함수라 안쪽의 this가 이 Response를 가리킨다.
      return {
        getReader: () => {
          let done = false;
          return {
            read: async () => {
              if (done) return { done: true, value: undefined };
              done = true;
              const text = await this.clone().text();
              return { done: false, value: new TextEncoder().encode(text) };
            },
            releaseLock() {},
          };
        },
      };
    },
  });
}
