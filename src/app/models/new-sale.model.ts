export interface NewSale {
  email: string;
  projectName: string;
  websiteLink: string;
  projectDescription: string;
  logoUrl: string;
  tokenName: string;
  tokenSymbol: string;
  tokenAddress: string;
  tokenSupply: string;
  salePrice: string;
  startDate: any
  startTime: string;
  duration: string;
  status: string;
  hasMaxMin: boolean;
  maxAlloc?: string;
  minAlloc?: string;
  hasWhitelist: boolean;
  addresses: string [];
  crowdsaleContract: string;
}
