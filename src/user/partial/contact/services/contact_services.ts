import { paginatedData } from '@utils/pagination';
import { ContactUs, ContactUsDocument } from '../model/contact_model';

class ContactService {
  public async getAllContacts(
    match: Record<string, any>,
    sort: Record<string, any>,
    page: number,
    perPage: number,
  ) {
    return await paginatedData(ContactUs, match, sort, page, perPage);
  }

  public async getContactById(id: string): Promise<ContactUsDocument | null> {
    return ContactUs.findById(id);
  }

  public async createContact(
    data: Partial<ContactUsDocument>,
  ): Promise<ContactUsDocument> {
    return ContactUs.create(data);
  }

  public async deleteContact(id: string): Promise<ContactUsDocument | null> {
    return ContactUs.findByIdAndUpdate(id, { deleted: true }, { new: true });
  }

  public async updateContactStatus(
    id: string,
    data: Partial<ContactUsDocument>,
  ): Promise<ContactUsDocument | null> {
    return await ContactUs.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new ContactService();
