import { v4 as uuidv4 } from 'uuid';

function generateUniqueId(length) {
    const uuid = uuidv4();
    const uniqueId = uuid.replace(/-/g, '').substring(0, length);
    return uniqueId;
}

export default generateUniqueId;