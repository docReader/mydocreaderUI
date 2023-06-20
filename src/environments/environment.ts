// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  angularBaseUrl: 'http://localhost:4200',
  //remoteAPIBaseUrl: 'https://ocr-dev.apurbatech.com:9090',
  //remoteAPIFileUploadBaseUrl: 'http://document-reader.apurbatech.com:9001',
  //remoteTemplateBaseURL: 'http://ocr.apurbatech.com:9852/',
  //nonmemberDefaultProjectId: 359  
  //remoteAPIBaseUrl: 'https://documentreader.live.mygov.bd',  
  //remoteAPIFileUploadBaseUrl: 'https://documentreader.live.mygov.bd/files',
  //remoteTemplateBaseURL: 'https://documentreader.live.mygov.bd/dr-core/',
  remoteAPIBaseUrl: 'https://mydocreader.gov.bd',
  remoteAPIFileUploadBaseUrl: 'https://mydocreader.gov.bd/files',  
  remoteTemplateBaseURL: 'https://mydocreader.gov.bd/dr-core/',
  nonmemberDefaultProjectId: 4
};
