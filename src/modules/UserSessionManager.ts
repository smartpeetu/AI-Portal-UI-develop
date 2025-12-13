/* eslint-disable @typescript-eslint/no-explicit-any */
export default class UserSessionManager {
  private keys = {
    accessToken: "access-token",
    idToken: "id-token",
    username: "username",
    userId: "user-id",
    user: "user",
    isOktaEnabled: "is-okta-enabled",
    isSideBarCollapsed: "is-sidebar-collapsed",
  };

  get accessToken(): string | null {
    return this.getItem<string>(this.keys.accessToken);
  }
  set accessToken(value: string | null) {
    this.setItem(this.keys.accessToken, value);
  }

  get idToken(): string | null {
    return this.getItem<string>(this.keys.idToken);
  }
  set idToken(value: string | null) {
    this.setItem(this.keys.idToken, value);
  }

  get username(): string | null {
    return this.getItem<string>(this.keys.username);
  }
  set username(value: string | null) {
    this.setItem(this.keys.username, value);
  }

  get userId(): number {
    return this.getItem<number>(this.keys.userId) ?? 0;
  }
  set userId(value: number) {
    this.setItem(this.keys.userId, value);
  }

  get user(): any | null {
    return this.getItem<any>(this.keys.user);
  }
  set user(value: any | null) {
    this.setItem(this.keys.user, value);
  }

  get isOktaEnabled(): boolean {
    const value = this.getItem<boolean>(this.keys.isOktaEnabled);
    return value === true;
  }
  set isOktaEnabled(value: boolean) {
    this.setItem(this.keys.isOktaEnabled, value);
  }

  get isSideBarCollapsed(): boolean {
    const value = this.getItem<boolean>(this.keys.isSideBarCollapsed);
    return value === true;
  }
  set isSideBarCollapsed(value: boolean) {
    this.setItem(this.keys.isSideBarCollapsed, value);
  }

  private setItem<T>(key: string, value: T): void {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  private getItem<T>(key: string): T | null {
    try {
      const rawValue = localStorage.getItem(key);
      if (!rawValue || rawValue === "undefined" || rawValue === "null") {
        return null;
      }
      return JSON.parse(rawValue) as T;
    } catch (e) {
      console.error("Storage error:", e);
      return null;
    }
  }

  clearLocal = () => {
    localStorage.clear();
  };
}
