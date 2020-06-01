import { Observable, of } from 'rxjs';
import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { RestClient } from '../rest-client';
import { Get } from './request-methods';
import { restClient } from './rest-client';

describe('@restClient', () => {

  it('verify decorator attributes are added to the Request', () => {
    // Arrange
    const requestMock = new HttpMock(() => {
      return of(new HttpResponse<any>({status: 200}));
    });
    const testClient = new TestClient(requestMock);

    // Assert
    expect(testClient.getServiceIdWrapper()).toBe( 'customer-service');
    expect(testClient.getBaseUrlWrapper()).toBe( '/api/v1/customers');
    expect(testClient.isWithCredentialsWrapper()).toBeFalsy();
    expect(testClient.getDefaultHeadersWrapper() as any).toStrictEqual ({
      'content-type': 'application/json'
    });

  });
});

class HttpMock extends HttpClient {

  public callCount = 0;
  public lastRequest: HttpRequest<any>;

  constructor( private requestFunction: ( req: HttpRequest<any> ) => Observable<HttpResponse<any>> ) {
    super(null);
  }

  request<R>(req: HttpRequest<any>|any, p2?: any, p3?: any, p4?: any): Observable<any> {
    this.callCount++;
    this.lastRequest = req;
    return this.requestFunction(req);
  }

}

@restClient({
  serviceId: 'customer-service',
  baseUrl: '/api/v1/customers',
  headers: {
    'content-type': 'application/json'
  }
})
class TestClient extends RestClient {

  constructor( httpHandler: HttpClient ) {
    super( httpHandler );
  }

  @Get('/test')
  public getItems(): Observable<HttpResponse<any>> {
    return null;
  }

  public getServiceIdWrapper(): string {
    return this.getServiceId();
  }

  public getBaseUrlWrapper(): string {
    return this.getBaseUrl();
  }

  public getDefaultHeadersWrapper(): { [header: string]: string | string[]; } {
    return this.getDefaultHeaders();
  }

  public isWithCredentialsWrapper(): boolean {
    return this.isWithCredentials();
  }

}
