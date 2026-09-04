export type HealthStatus = 'ok';

export type Health = Readonly<{
  status: HealthStatus;
  service: string;
  version: string;
  checkedAt: Date;
}>;
