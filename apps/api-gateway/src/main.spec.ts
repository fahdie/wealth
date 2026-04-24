const mockSetGlobalPrefix = jest.fn();
const mockListen = jest.fn().mockResolvedValue(undefined);
const mockLoggerLog = jest.fn();
const mockCreate = jest.fn().mockResolvedValue({
  setGlobalPrefix: mockSetGlobalPrefix,
  listen: mockListen,
});

jest.mock('@nestjs/core', () => ({
  NestFactory: { create: mockCreate },
}));

jest.mock('@nestjs/common', () => ({
  Logger: { log: mockLoggerLog },
}));

jest.mock('./app/app.module', () => ({
  AppModule: class MockAppModule {},
}));

const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('api-gateway bootstrap', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('creates the Nest application using AppModule', async () => {
    require('./main');
    await flushPromises();
    expect(mockCreate).toHaveBeenCalledTimes(1);
  });

  it('sets the global API prefix to "api"', async () => {
    require('./main');
    await flushPromises();
    expect(mockSetGlobalPrefix).toHaveBeenCalledWith('api');
  });

  it('listens on default port 3000 when PORT env is not set', async () => {
    delete process.env['PORT'];
    require('./main');
    await flushPromises();
    expect(mockListen).toHaveBeenCalledWith(3000);
  });

  it('listens on the PORT env variable when set', async () => {
    process.env['PORT'] = '4200';
    require('./main');
    await flushPromises();
    expect(mockListen).toHaveBeenCalledWith('4200');
  });

  it('logs the running server URL after startup', async () => {
    delete process.env['PORT'];
    require('./main');
    await flushPromises();
    expect(mockLoggerLog).toHaveBeenCalledWith(
      expect.stringContaining('http://localhost:3000/api')
    );
  });
});
