import { Request, Response } from 'express';
import ContactService from '../services/contact_services';
import { success, apiError } from '@utils/response';
import { getMatchAndSortData } from '@utils/pagination';
import { sendEmail } from 'helper/email_helper';
import { generateContactEmailHTML } from '@utils/email/generateContactHtml';
import config from '@utils/config';

class ContactController {
  public async getContacts(req: Request, res: Response): Promise<void> {
    try {
      const { matchData, sortData } = await getMatchAndSortData(req);
      const { page = 1, perPage = 10 } = req.query;
      const search = req.query.search;
      if (search) {
        matchData.$or = [{ name: { $regex: search, $options: 'i' } }];
      }
      const contacts = await ContactService.getAllContacts(
        matchData,
        sortData,
        Number(page),
        Number(perPage),
      );

      res
        .status(200)
        .json(success('Contacts fetched successfully', 200, contacts));
    } catch (error: any) {
      const response = await apiError(
        'Failed to fetch contacts',
        error.message,
        500,
      );
      res.status(500).json(response);
    }
  }

  public async getContact(req: Request, res: Response): Promise<void> {
    try {
      const contact = await ContactService.getContactById(req.params.id);
      if (contact) {
        res
          .status(200)
          .json(success('Contact fetched successfully', 200, contact));
      } else {
        res.status(404).json(await apiError('Contact not found', {}, 404));
      }
    } catch (error: any) {
      const response = await apiError(
        'Failed to fetch contact',
        error.message,
        500,
      );
      res.status(500).json(response);
    }
  }

  public async createNewContact(req: Request, res: Response): Promise<void> {
    try {
      const newContact = await ContactService.createContact(req.body);

      const emailHTML = generateContactEmailHTML(
        newContact.name,
        newContact.phone,
        newContact.message,
      );
      await sendEmail(config.ADMIN_EMAIL, 'New Contact Submission', emailHTML);
      res
        .status(201)
        .json(success('Contact form submitted successfully', 201, newContact));
    } catch (error: any) {
      const response = await apiError(
        'Failed to create contact',
        error.message,
        500,
      );
      res.status(500).json(response);
    }
  }

  public async deleteContactPost(req: Request, res: Response): Promise<void> {
    try {
      const deletedContact = await ContactService.deleteContact(req.params.id);
      if (deletedContact) {
        res.status(200).json(success('Contact deleted successfully', 200, {}));
      } else {
        res.status(404).json(await apiError('Contact not found', {}, 404));
      }
    } catch (error: any) {
      const response = await apiError(
        'Failed to delete contact',
        error.message,
        500,
      );
      res.status(500).json(response);
    }
  }

  public async updateContactStatus(req: Request, res: Response): Promise<void> {
    try {
      const contact = await ContactService.updateContactStatus(
        req.params.id,
        req.body,
      );
      if (contact) {
        res
          .status(200)
          .json(success('Contact status updated successfully', 200, contact));
      } else {
        res.status(404).json(await apiError('Contact not found', {}, 404));
      }
    } catch (error: any) {
      const response = await apiError(
        'Failed to update Contact status',
        error.message,
        500,
      );
      res.status(500).json(response);
    }
  }
}

export default new ContactController();
