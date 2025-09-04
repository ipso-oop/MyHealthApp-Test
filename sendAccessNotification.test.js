const { sendAccessNotification, setDb } = require('./app');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://localhost:27017'; // Dummy-URI für Tests
process.env.MONGODB_DB_NAME = 'testdb'; // Falls benötigt

jest.mock('nodemailer');

describe('sendAccessNotification', () => {
  const mockSendMail = jest.fn().mockResolvedValue(true); // <-- Promise statt Callback

  beforeEach(() => {
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

 

  it('sollte keine E-Mail senden, wenn kein Benutzer gefunden wird', async () => {
    const userId = new ObjectId();
    const mockDb = {
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
      }),
    };

    setDb(mockDb);

    sendAccessNotification(userId);

    expect(mockSendMail).not.toHaveBeenCalled();
  });
});
