  declare type GetRecordByArray_P<T extends readonly string[]> = {
    [Key in T[number]]: string | number | boolean | null;
  };
  declare type GetKeysByArray_OR<T extends readonly string[]> = T[number];
  type TypeAndNull<T> = T | null;

  declare type ValueOf<T> = T[keyof T];

