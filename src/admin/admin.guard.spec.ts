import { AdminGuard } from '../admin/admin.guard';
describe('AdminGuard', () => {
  it('should not allow access if user is not admin', () => {
    const guard = new AdminGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'USER' },
        }),
      }),
    } as any;
    expect(guard.canActivate(context)).toBe(false);
  });
  it('should allow access if user is admin', () => {
    const guard = new AdminGuard();
    const context = {
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: 'ADMIN' },
        }),
      }),
    } as any;
    expect(guard.canActivate(context)).toBe(true);
  });
});
