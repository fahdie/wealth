const mockBootstrapApplication = jest.fn().mockResolvedValue(undefined);

jest.mock('@angular/platform-browser', () => ({
  bootstrapApplication: mockBootstrapApplication,
}));

jest.mock('./app/app.config', () => ({
  appConfig: { providers: [] },
}));

jest.mock('./app/app', () => ({
  App: class MockApp {},
}));

const flushPromises = () => new Promise<void>((resolve) => setImmediate(resolve));

describe('advisor-portal bootstrap', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it('calls bootstrapApplication once on load', async () => {
    require('./main');
    await flushPromises();
    expect(mockBootstrapApplication).toHaveBeenCalledTimes(1);
  });

  it('passes the App component to bootstrapApplication', async () => {
    const { App } = require('./app/app');
    require('./main');
    await flushPromises();
    expect(mockBootstrapApplication).toHaveBeenCalledWith(App, expect.anything());
  });

  it('passes appConfig to bootstrapApplication', async () => {
    const { appConfig } = require('./app/app.config');
    require('./main');
    await flushPromises();
    expect(mockBootstrapApplication).toHaveBeenCalledWith(expect.anything(), appConfig);
  });

  it('logs bootstrap errors to console.error', async () => {
    const error = new Error('Bootstrap failed');
    mockBootstrapApplication.mockRejectedValueOnce(error);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    require('./main');
    await flushPromises();
    expect(consoleSpy).toHaveBeenCalledWith(error);
    consoleSpy.mockRestore();
  });
});
