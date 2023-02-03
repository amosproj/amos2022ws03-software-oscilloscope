
//Unit Test Code
import { jest } from '@jest/globals';
import chai from "chai";
import sinon from "sinon";
import sinonChai from 'sinon-chai'
import config from '../../../rest/controllers/config';

chai.use(sinonChai)
const expect = chai.expect;

describe('ConfigController', () => {
  let configService;

  beforeEach(() => {
    configService = {
      getConfigs: sinon.stub(),
      postConfig: sinon.stub(),
    };
  });

  describe('GET', () => {
    it('should return HTTP 200 and JSON object if there is a valid channel config file', () => {
      const req = {};
      const res = { status: sinon.stub().returns({ json: sinon.spy() }) };
      const presets = [{ id: 1, name: 'test' }];

      configService.getConfigs.returns(presets);

      const next = sinon.spy();
      let controllerFn = config(configService);

      controllerFn.GET(req, res, next);

      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith(presets);
    });
  });

  describe('POST', () => {
    it('should respond with status code 200 and return the postConfig result', () => {
      const req = { body: {}, query: { id: '123' } };
      const res = { status: sinon.stub().returns({ json: sinon.spy() }) };
      const configService = { postConfig: jest.fn().mockReturnValue('config') };  
      
      const next = sinon.spy();
      let controllerFn = config(configService);

      controllerFn.POST(req, res, next);
  
      expect(res.status).to.have.been.calledWith(200);
      expect(res.status().json).to.have.been.calledWith('config');
    });
  });
});