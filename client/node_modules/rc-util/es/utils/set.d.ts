export declare type Path = (string | number)[];
export default function set<Entity = any, Output = Entity, Value = any>(entity: Entity, paths: (string | number)[], value: Value, removeIfUndefined?: boolean): Output;
/**
 * Merge objects which will create
 */
export declare function merge<T extends object>(...sources: T[]): T;
