import { Platform } from 'react-native';
import { axiosInstance } from '.';

export type OsType = 'Android' | 'iOS';

export interface VersionCheckResult {
  latestVersion: string;
  updateUrl: string;
}

export interface VersionCheckResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: VersionCheckResult;
}

const osType: OsType = Platform.OS === 'ios' ? 'iOS' : 'Android';

export const versionAPI = {
  check: async (): Promise<VersionCheckResult> => {
    const response = await axiosInstance.get<VersionCheckResponse>(
      '/version/check',
      { params: { osType } },
    );

    if (!response.data.isSuccess) {
      throw new Error(response.data.message);
    }

    return response.data.result;
  },
};
