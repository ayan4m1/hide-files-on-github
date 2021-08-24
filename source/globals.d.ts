declare module "size-plugin";

interface ApiSettings {
	filesPreview: boolean;
	hideRegExp: string;
}

interface ApiStorage {
  get(): Promise<ApiSettings>
  set(object: ApiSettings): void
}
