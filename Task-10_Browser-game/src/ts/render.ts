export enum HTMLTags {
    Table = 'table',
    TableRow = 'tr',
    TableData = 'td',
    h2 = 'h2',
    TextArea = 'textarea',
    Button = 'button',
    Div = 'div',
}

interface IRenderItem {
    element?: HTMLElement | string,
    tag?: HTMLTags,
    attributes?: any,
    childs?: Array<IRenderItem>,
    value?: string
}

export function render(item: IRenderItem) {
    if (item.element) {
        return item.element;
    }

    let element = document.createElement(item.tag,);
    item.element = element;

    if (item.attributes) {
        for (let name in item.attributes) {
            let value = item.attributes[name];
            element.setAttribute(name, value);
        }
    }

    if (item.value) {
        element.innerHTML = item.value;
    }

    if (item.childs) {
        for (let child of item.childs) {
            if (!child.element) {
                render(child);
            }
            element.append(child.element);
        }
    }

    return element;
}

export class RenderItemBuilder implements IRenderItem {
    element?: HTMLElement | string;
    tag?: HTMLTags;
    attributes?: any;
    childs?: Array<IRenderItem>;
    value?: string;
    constructor(tag?: HTMLTags) {
        this.tag = tag;
    }
    static create(tag: HTMLTags): RenderItemBuilder {
        return new RenderItemBuilder(tag);
    }
    static createText(text: string): RenderItemBuilder {
        let builder = new RenderItemBuilder();
        builder.element = text;
        return builder
    }
    public setAttribute(name: string, value: string): RenderItemBuilder {
        this.attributes = this.attributes || {};
        this.attributes[name] = value;
        return this;
    }
    public setValue(value: string): RenderItemBuilder {
        this.value = value;
        return this;
    }
    public addChilds(...child: IRenderItem[]): RenderItemBuilder {
        this.childs = this.childs || [];
        this.childs.push(...child);
        return this;
    }
    public render(): RenderItemBuilder {
        render(this);
        return this;
    }
}