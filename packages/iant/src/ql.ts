import { IQLangProps, TPath, TQLang } from './types';

let id = 0;

export class QueryLang {
  constructor(props: IQLangProps) {
    const { name, lang } = props;
    this.id = ++id;
    this.name = name;
    this.lang = lang;
  }

  private id: number;
  private name: string;
  private lang: TQLang;

  meta() {
    const lang = this.lang.slice();
    const handler = lang.pop() as Function;
    const deps = lang as Array<TPath>;

    return {
      id: this.id,
      name: this.name,
      deps,
      handler
    };
  }
}

export const QL = (lang: TQLang, name: string = '') =>
  new QueryLang({ name, lang });
