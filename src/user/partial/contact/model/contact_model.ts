import { stat } from 'fs';
import { getFormattedDate } from 'helper/data_format_helper';
import { Schema, model, Document, PaginateModel } from 'mongoose';
import mongooseDelete from 'mongoose-delete';
import mongoosePaginate from 'mongoose-paginate-v2';
import schemaMetadataPlugin from 'plugins/commonStatics';
import { ISEO } from 'interface/seo_interface';
export enum ContactUsStatus {
  Pending = 'pending',
  FollowedUp = 'followed-up',
}

export interface ContactUsDocument extends Document {
  name: string;
  phone: string;
  address: string;
  message: string;
  followUpNote?: string;
  status: ContactUsStatus;
  seo?: ISEO;
}
const seoSchema = new Schema(
  {
    metaTitle: { type: String },
    metaDescription: { type: String },
    ogTitle: { type: String },
    ogDescription: { type: String },
    canonicalUrl: { type: String },
  },
  { _id: false },
);
const ContactUsSchema = new Schema<ContactUsDocument>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    message: { type: String, required: false },
    followUpNote: { type: String, required: false },
    status: {
      type: String,
      enum: Object.values(ContactUsStatus),
      default: ContactUsStatus.Pending,
    },
    seo: { type: seoSchema },
  },
  { timestamps: true },
);

ContactUsSchema.plugin(mongoosePaginate);
ContactUsSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: 'all',
});

const defaultComponentOverrides: Record<string, string> = {
  status: 'SelectEnumInputField',
  followUpNote: 'RichTextEditor',
};
const refFieldMapping: Record<string, { model: string; strField: string }> = {};
ContactUsSchema.plugin(schemaMetadataPlugin, {
  defaultComponentOverrides,
  refFieldMapping,
});

ContactUsSchema.statics.getTableFields = function () {
  return ['name', 'phone', 'address', 'status'];
};

ContactUsSchema.statics.getSingleInstanceState = function () {
  return false;
};
ContactUsSchema.statics.getViewOnlyFields = function () {
  return true;
};

ContactUsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret, options) {
    const retJson = {
      object: 'contacts',
      id: ret._id,
      name: ret.name,
      phone: ret.phone,
      address: ret.address,
      message: ret.message,
      followUpNote: ret.followUpNote,
      status: ret.status,
      seo: ret.seo || {},
      created_date: getFormattedDate(ret.createdAt),
      updated_date: getFormattedDate(ret.updatedAt),
    };
    return retJson;
  },
});
interface IContactUsModel extends PaginateModel<ContactUsDocument> {
  getFieldMetadata: () => Record<string, any>;
  getTableFields: () => string[];
  getSingleInstanceState: () => boolean;
  getViewOnlyFields: () => boolean;
}

export const ContactUs = model<ContactUsDocument, IContactUsModel>(
  'ContactUs',
  ContactUsSchema,
);
