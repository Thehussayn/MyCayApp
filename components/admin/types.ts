export type ActionProps = {
  busy: boolean;
  act: (body: any) => Promise<boolean>;
};
