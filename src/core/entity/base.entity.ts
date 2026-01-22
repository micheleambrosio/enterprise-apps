export type BaseEntityProps = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export abstract class BaseEntity {
  protected readonly id: BaseEntityProps['id'];
  protected createdAt: BaseEntityProps['createdAt'];
  protected updatedAt: BaseEntityProps['updatedAt'];

  constructor(data: BaseEntityProps) {
    Object.assign(this, data);
  }

  abstract serialize(): Record<string, unknown>;

  getId() {
    return this.id;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
