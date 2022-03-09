export abstract class BaseModel {

  id: number;
  name: string;

}

export abstract class FilterableModel extends BaseModel {

  visible: boolean = true;  

}