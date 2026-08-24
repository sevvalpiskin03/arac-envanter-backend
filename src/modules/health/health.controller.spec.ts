import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('çalışan API durumunu döndürür', () => {
    const result = new HealthController().getHealth();

    expect(result.status).toBe('ok');
    expect(Number.isNaN(Date.parse(result.timestamp))).toBe(false);
  });
});

