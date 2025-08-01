// src/repositories/BaseRepository.ts
import { Model, FilterQuery, UpdateQuery } from "mongoose";

export class BaseRepository<T> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const doc = await this.model.create(data);
    return doc.toObject() as T;
  }

  async update(
    filter: FilterQuery<T>,
    updateData: UpdateQuery<T>
  ): Promise<T | null> {
    const updatedDoc = await this.model.findOneAndUpdate(filter, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedDoc ? (updatedDoc.toObject() as T) : null;
  }

  async delete(filter: FilterQuery<T>): Promise<boolean> {
    const result = await this.model.deleteOne(filter);
    return result.deletedCount === 1;
  }
}
