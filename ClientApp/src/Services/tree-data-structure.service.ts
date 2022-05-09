import { Injectable } from "@angular/core";

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

@Injectable({
  providedIn: 'root'
})
export class TreeDataStructureService<T> {
  private _data: T[] = [];
  private _parentPropertyName = "";
  private roots: T[] = [];
  private parentChildrenMap: Map<{ parent: T, isRoot: boolean; }, T[]> = new Map<{ parent: T, isRoot: boolean; }, T[]>();
  constructor()
  {

  }
  setData(Data: T[], parentPropertyName: string = "parentKey")
  {
    this._data = Data;
    this._parentPropertyName = parentPropertyName;
  }
  getRoots(): Tree<T>[]
  {
    let items_whitNoParents = this._data.filter(x => getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T) == null || Number(getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T)) === 0);
    items_whitNoParents.forEach(x => this.roots.push(x));
    let roots: Tree<T>[] = [];
    for (let r of items_whitNoParents)
    {
      roots.push(new Tree<T>(r));
    }
    return roots;
  }
  getRawRoots()
  {
    return this._data.filter(x => getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T) == null || Number(getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T)) === 0);
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
  getChilrenByParentId(parentId: number)
  {
    return this._data.filter(x => Number(getKeyValue<T, keyof T>(x, this._parentPropertyName as keyof T)) === parentId);
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
  public ParentToChildMap()
  {
    let finalArray = this.finalFlatenArray();
    for (let item of finalArray)
    {
      let children = this.getChilrenByParentId(Number(getKeyValue<T, keyof T>(item, 'id' as keyof T)));
      let isRoot = getKeyValue<T, keyof T>(item, this._parentPropertyName as keyof T) === null || Number(getKeyValue<T, keyof T>(item, this._parentPropertyName as keyof T)) === 0;
      if (children.length > 0 || isRoot)
        this.parentChildrenMap.set({
          parent: item,
          isRoot: isRoot
        }, children);
    }
    return this.parentChildrenMap;
  }
};