import s3Config from '@config/s3/s3';
import multer from 'multer';
import multerS3 from 'multer-s3';

export interface CustomFile extends Express.Multer.File {
  key: string;
  location: string;
}

export const uploadImage = multer({
  storage: multerS3({
    s3: s3Config,
    bucket: process.env.AWS_BUCKET_NAME!,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `file/${Date.now()}-${file.originalname}`);
    },
  }),
  limits: { fileSize: 30 * 1024 * 1024 },
});

export const imageFile = uploadImage.single('icon');
export const authorityImageFile = uploadImage.single('image');
export const expertImageFile = uploadImage.single('image');
export const testimonialImageFile = uploadImage.single('image');
export const teamImageFile = uploadImage.single('image');

export const bannerImageFile = uploadImage.fields([
  { name: 'image', maxCount: 1 },
]);

export const aboutUsImageFile = uploadImage.fields([
  { name: 'sectionOneImage', maxCount: 1 },
]);

export const homePageImageUpload = uploadImage.fields([
  { name: 'sectionOneImage', maxCount: 1 },
  { name: 'sectionTwoImages', maxCount: 4 },
  { name: 'sectionThreeImages', maxCount: 4 },
]);
export const ProjectImageUpload = uploadImage.fields([
  { name: 'icon', maxCount: 1 },
]);

export const aboutUsImageUpload = uploadImage.fields([
  { name: 'leaderImage', maxCount: 1 },
  { name: 'familyImage', maxCount: 1 },
  { name: 'familySecondImage', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  { name: 'officeImages', maxCount: 40 },
]);

export const whychoooseIconUpload = uploadImage.fields([
  { name: 'icon', maxCount: 1 },
]);

export const projectsImageUpload = uploadImage.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'sectionOneImage', maxCount: 1 },
  { name: 'sectionTwoImage', maxCount: 1 },
  { name: 'sectionOneImages', maxCount: 2 },
  { name: 'sectionTwoImages', maxCount: 2 },
]);

export const updateProjectImage = uploadImage.fields([
  { name: 'mainImage', maxCount: 1 },
]);
export const updateSectionOneImage = uploadImage.fields([
  { name: 'mainImage', maxCount: 1 },
]);

export const gallaryImageUpload = uploadImage.fields([
  { name: 'mainImage', maxCount: 1 },
  { name: 'images', maxCount: 12 },
]);

export const expertiseImageUpload = uploadImage.fields([
  { name: 'Image', maxCount: 1 },
  { name: 'conceptImage', maxCount: 1 },
  { name: 'ideaImage', maxCount: 1 },
  { name: 'designImage', maxCount: 1 },
  { name: 'visionImage', maxCount: 1 },
  { name: 'buildImage', maxCount: 1 },
  { name: 'investmentImage', maxCount: 1 },
]);

export const settingServiceMultiple = uploadImage.fields([
  { name: 'header_logo', maxCount: 1 },
  { name: 'footer_logo', maxCount: 1 },
  { name: 'banner_image', maxCount: 1 },
  { name: 'backgroundImage', maxCount: 1 },
]);

export const blogImageFile = uploadImage.fields([
  { name: 'image', maxCount: 1 },
  { name: 'caroselImages', maxCount: 2 },
]);

export const uploadServiceMultiple = uploadImage.fields([
  { name: 'icon', maxCount: 1 },
  { name: 'image', maxCount: 1 },
  // { name: 'whyUs', maxCount: 1 },
]);

export const childServiceImageUpload = uploadImage.fields([
  { name: 'image', maxCount: 1 },
]);

export const BrandImageUpload = uploadImage.fields([
  { name: 'brandLogo', maxCount: 1 },
]);

export const sisterCompanyImageUpload = uploadImage.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'image', maxCount: 1 },
]);

export const familyImageUpload = uploadImage.fields([
  { name: 'familyImage', maxCount: 1 },
]);

export const LeaderImageUplaod = uploadImage.fields([
  { name: 'leaderImage', maxCount: 1 },
]);
