import mongoose, { ClientSession, Model, Document } from 'mongoose';

export const create = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
): Promise<T> => {
  return await model.create(data);
};

export const createWithSession = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
  session: ClientSession,
): Promise<T> => {
  const [created] = await model.create([data], { session });
  return created;
};

export const getAll = async <T extends Document>(
  model: Model<T>,
): Promise<T[]> => {
  return await model.find();
};

export const getById = async <T extends Document>(
  model: Model<T>,
  id: string,
): Promise<T | null> => {
  return await model.findById(new mongoose.Types.ObjectId(id));
};

export const getByIdWithPopulated = async <T extends Document>(
  model: Model<T>,
  id: string,
  relatedModel: string[] = [],
): Promise<T | null> => {
  let query = model.findById(id);
  relatedModel.forEach((val) => {
    query = query.populate(val);
  });
  return await query.exec();
};

export const getByIdWithNestedPopulated = async <T extends Document>(
  model: Model<T>,
  id: string,
  populatedModels: any[] = [],
): Promise<T | null> => {
  return await model.findById(id).populate(populatedModels).exec();
};

export const getByIdWithAllDoc = async <T extends Document>(
  model: Model<T>,
  id: string,
): Promise<T | null> => {
  return await model.findById(id);
};

export const getDataByIdWithRelatedDocId = async <T extends Document>(
  model: Model<T>,
  id: string,
  childField: string,
  childValue: any,
): Promise<T[]> => {
  return await model.find({ _id: id, [childField]: childValue });
};

export const getByIdWithRelatedDocId = async <T extends Document>(
  model: Model<T>,
  id: string,
  childField: string,
  childValue: any,
  selectField: string,
): Promise<T[]> => {
  return await model
    .find({ _id: id, [childField]: childValue })
    .select(selectField);
};

export const updateById = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
  relatedModel: string[] = [],
): Promise<T | null> => {
  const updates = { ...data };
  let query = model.findByIdAndUpdate(
    data.id,
    { $set: updates },
    { new: true, useFindAndModify: false },
  );
  relatedModel.forEach((val) => {
    query = query.populate(val);
  });
  return await query.exec();
};

export const updateOrInsert = async <T extends Document>(
  model: Model<T>,
  data: Partial<T>,
): Promise<T | null> => {
  const updates = { ...data };
  return await model.findByIdAndUpdate(
    data.id,
    { $set: updates },
    { new: true, useFindAndModify: false, upsert: true },
  );
};

export const deleteById = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
): Promise<T | null> => {
  if (data.deletedBy) {
    await model.findByIdAndUpdate(data.id, { deletedBy: data.deletedBy });
  }
  return await model.findByIdAndDelete(data.id, {
    new: true,
    useFindAndModify: false,
  });
};

export const deleteByIdSession = async <T extends Document>(
  model: Model<T>,
  data: { id: string; deletedBy?: string },
  session: ClientSession,
): Promise<T | null> => {
  if (data.deletedBy) {
    await model.findByIdAndUpdate(data.id, { deletedBy: data.deletedBy });
  }
  return await model.findByIdAndDelete(data.id, {
    session,
    new: true,
    useFindAndModify: false,
  });
};
