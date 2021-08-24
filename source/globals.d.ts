declare module "size-plugin";

interface ApiSettings {
	filesPreview: boolean;
	hideRegExp: string;
}

interface ApiStorage {
  get(): Promise<ApiSettings>
  set(object: ApiSettings): void
}

interface FeatureConstructor {
	new (settings: ApiSettings): Feature
}

interface Feature {
	get selector(): string
	update(): void;
}
