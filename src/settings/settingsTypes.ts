export interface Component {
  render: () => void;
  rerender: () => void;
  children?: Component | Component[];
}

export interface StatefulComponent<T> extends Component {
  title: string;
  state: T;
  sectionEl?: HTMLElement;
}
