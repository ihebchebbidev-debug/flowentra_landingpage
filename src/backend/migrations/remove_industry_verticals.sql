-- Removes the deprecated industryVerticals CMS section and all related content.
-- Safe to run multiple times.

DELETE FROM `flowentra_cms_content` WHERE `section_key` = 'industryVerticals';
DELETE FROM `flowentra_cms_fields` WHERE `section_key` = 'industryVerticals';
DELETE FROM `flowentra_cms_sections` WHERE `section_key` = 'industryVerticals';

-- Remove any custom-page sections of this type
DELETE FROM `flowentra_page_sections` WHERE `section_type` = 'industryVerticals';
