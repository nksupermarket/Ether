export interface Component {
  render: (state: any) => void;
  rerender: (state: any) => void;
  // render: ((state: { [key: string]: string }) => void) | (() => void);
  // rerender: ((state: { [key: string]: string }) => void) | (() => void);
}
