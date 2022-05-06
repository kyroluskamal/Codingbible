const getKeyValue = <T, K extends keyof T>(obj: T, key: K): T[K] => obj[key];

export class TreeNode<T> {

  private _data: T;
  private _parent: TreeNode<T> | null;
  private _children: TreeNode<T>[];

  constructor(data: T, parent: TreeNode<T> | null, children: TreeNode<T>[] = [])
  {
    this._data = data;
    this._parent = parent;
    this._children = children;
  }

  get data(): T
  {
    return this._data;
  }

  get parent(): TreeNode<T> | null
  {
    return this._parent;
  }

  get children(): TreeNode<T>[]
  {
    return this._children;
  }

  addChild(child: TreeNode<T>)
  {
    this._children.push(child);
  }
}

export class Tree<T> {

  private _root: TreeNode<T>;

  constructor(data: T)
  {
    this._root = new TreeNode<T>(data, null);
  }

  getRoot(): TreeNode<T>
  {
    return this._root;
  }
}


export class TreeDataStructureService<T> {
  private _data: T[];
  private _parentPropertyName;
  constructor(Data: T[], private parentPropertyName: string)
  {
    this._data = Data;
    this._parentPropertyName = parentPropertyName;
    console.log(this._data);
  }

  getRoots(): Tree<T>[]
  {
    let items_whitNoParents = this._data.filter(x => getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T) == null || Number(getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T)) === 0);
    let roots: Tree<T>[] = [];
    for (let r of items_whitNoParents)
    {
      roots.push(new Tree<T>(r));
    }
    return roots;
  }
  getChilren(parentId: number, parentNode: TreeNode<T>): TreeNode<T>[]
  {
    let children = this._data.filter(x => Number(getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T)) === parentId);
    let childrenNodes: TreeNode<T>[] = [];
    for (let child of children)
    {
      childrenNodes.push(new TreeNode<T>(child, parentNode));
    }
    return childrenNodes;
  }

  buildForest(): Tree<T>[]
  {
    let roots = this.getRoots();
    for (let root of roots)
    {
      this.buildTree(root.getRoot());
    }
    return roots;
  }
  buildTree(roots: TreeNode<T>): void
  {
    let children = this.getChilren(Number(getKeyValue<T, keyof T>(roots.data, 'id' as keyof T)), roots);
    for (let child of children)
    {
      roots.addChild(child);
      this.buildTree(child);
    }
  }
  private flatTreeRecursive(tree: TreeNode<T>[]): TreeNode<T>[]
  {
    let flatTree: TreeNode<T>[] = [];
    for (let node of tree)
    {
      flatTree.push(node);
      flatTree = flatTree.concat(this.flatTreeRecursive(node.children));
    }
    return flatTree;
  }

  public finalFlatenArray(): T[]
  {
    let trees = this.buildForest();
    let finalArray: T[] = [];
    for (let tree of trees)
    {
      finalArray.push(tree.getRoot().data);
      let flatten_children = this.flatTreeRecursive(tree.getRoot().children);
      for (let child of flatten_children)
      {
        finalArray.push(child.data);
      }
    }
    return finalArray;
  }
};