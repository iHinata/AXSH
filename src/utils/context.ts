const PRODUCT = process.env.NODE_ENV === 'production';
export const context = PRODUCT ? '/appsummary/ui/' : '/ui/'
const SERVICE = 'http://116.62.162.198:8080/';
//  const SERVICE = 'http://localhost:3000/';
export const baseURL = PRODUCT ? SERVICE + '/appsummary' : '/appsummary'
export const WS = `${SERVICE}appsummary/endpoint`;
