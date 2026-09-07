export const normalizeName = (name = '') => {
  const str = String(name || '');
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\b(mr|mrs|ms|dr|prof|sir)\b\.?/gi, '')
    .replace(/[^a-z0-9\s]/gi, '')
    .trim()
    .split(/\s+/)
    .sort()
    .join(' ');
};

export const normalizePhone = (phone = '') => {
  const str = String(phone || '');
  if (!str) return '';
  const digits = str.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
};

export const normalizeEmail = (email = '') => {
  const str = String(email || '');
  if (!str) return '';
  const trimmed = str.toLowerCase().trim();
  const parts = trimmed.split('@');
  if (parts.length !== 2) return trimmed;

  let [local, domain] = parts;
  if (domain === 'gmail.com') {
    local = local.replace(/\./g, '').split('+')[0];
  }
  return `${local}@${domain}`;
};

export const normalizeRecord = (record) => {
  const rawName = record.name || '';
  const rawPhone = record.phone_number || record.phone || '';
  const rawEmail = record.email || '';
  const rawRegNo = String(record.reg_no || '');

  return {
    normalized_name: normalizeName(rawName),
    normalized_phone: normalizePhone(rawPhone),
    normalized_email: normalizeEmail(rawEmail),
    normalized_reg_no: rawRegNo.toUpperCase().trim()
  };
};
