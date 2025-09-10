import { Modal, Pressable, View } from 'react-native';

interface DefaultModalProps {
  children?: React.ReactNode;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

/**
 * react-native 기본 modal 기반 component
 *
 * children에 실제 contents 삽입. e.g.
 *
 * ```tsx
 * <DefaultModal visible={visible} setVisible={setVisible}>
 *   <View className='w-[336px] h-[312px] bg-white rounded-[7px]'>...</View>
 * </DefaultModal>
 * ```
 *
 * @param {React.ReactNode} [children]
 * @param {boolean} visible
 * @param {(visible: boolean) => void} setVisible
 *
 * @returns {JSX.Element}
 */
const DefaultModal = ({ children, visible, setVisible }: DefaultModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType='fade'
      onRequestClose={() => {
        setVisible(false);
      }}
      transparent
      statusBarTranslucent
    >
      <View
        className='flex-1 items-center justify-center'
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      >
        <Pressable
          className='absolute top-0 left-0 right-0 bottom-0'
          onPress={() => setVisible(false)}
        />
        {children}
      </View>
    </Modal>
  );
};

export default DefaultModal;
