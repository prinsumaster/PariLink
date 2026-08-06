import {
  SapConnector,
  OracleErpConnector,
  Dynamics365Connector,
  TallyConnector,
  ZohoBooksConnector,
  XeroConnector,
} from './erp.connectors';
import {
  GpsProviderConnector,
  FuelCardConnector,
  FastagConnector,
  EwayBillConnector,
  GstConnector,
  SmsGatewayConnector,
  EmailGatewayConnector,
  WhatsAppConnector,
  PaymentGatewayConnector,
} from './logistics.connectors';

describe('Enterprise Connectors Suite (ERP & Logistics)', () => {
  describe('ERP Connectors', () => {
    it('SAP S/4HANA connector should validate credentials and health check', async () => {
      const sap = new SapConnector();
      expect(sap.providerName).toBe('SAP_ERP');
      expect(
        sap.validateConfiguration({
          clientId: 'foo',
          clientSecret: 'bar',
          baseUrl: 'https://sap.example.com',
          clientNumber: '100',
        }),
      ).toBe(true);
      expect(sap.validateConfiguration({ clientId: '' })).toBe(false);
      const res = await sap.sync(
        'comp_1',
        { clientId: 'a', clientSecret: 'b' },
        'INVOICE',
        [{ id: 1 }],
      );
      expect((res as any).status).toBe('SUCCESS');
    });

    it('Oracle ERP Cloud connector should sync purchase orders', async () => {
      const oracle = new OracleErpConnector();
      expect(oracle.providerName).toBe('ORACLE_ERP');
      const res = await oracle.sync(
        'comp_1',
        { apiKey: 'k' },
        'PURCHASE_ORDER',
        [],
      );
      expect((res as any).status).toBe('SUCCESS');
    });

    it('Microsoft Dynamics 365 connector should validate tenantId and resourceUri', () => {
      const dyn = new Dynamics365Connector();
      expect(
        dyn.validateConfiguration({
          tenantId: 't',
          clientId: 'c',
          clientSecret: 's',
          resourceUri: 'https://dyn.example.com',
        }),
      ).toBe(true);
      expect(dyn.validateConfiguration({ clientId: 'c' })).toBe(false);
    });

    it('Tally Prime / Server 9 XML connector should format data', async () => {
      const tally = new TallyConnector();
      expect(tally.authType).toBe('BASIC');
      expect(tally.providerName).toBe('TALLY_PRIME');
      const res = await tally.sync('comp_1', { port: 9000 }, 'LEDGER', {});
      expect((res as any).status).toBe('SUCCESS');
    });

    it('Zoho Books and Xero connectors should support OAuth2', () => {
      const zoho = new ZohoBooksConnector();
      const xero = new XeroConnector();
      expect(zoho.authType).toBe('OAUTH2');
      expect(xero.authType).toBe('OAUTH2');
    });
  });

  describe('Logistics & Communication Connectors', () => {
    it('GPS & Fuel Card connectors should process telemetry sync', async () => {
      const gps = new GpsProviderConnector();
      const fuel = new FuelCardConnector();
      expect(gps.providerName).toBe('GPS_TELEMATICS_HUB');
      expect(fuel.providerName).toBe('FUEL_CARD_NETWORK');
      const resGps = await gps.sync(
        'comp_1',
        { apiKey: 'test' },
        'VEHICLE_LOCATION',
        {},
      );
      expect((resGps as any).status).toBe('SUCCESS');
    });

    it('FASTag, E-Way Bill, and GST connectors should handle compliance workflows', async () => {
      const fastag = new FastagConnector();
      const eway = new EwayBillConnector();
      const gst = new GstConnector();
      expect(fastag.providerName).toBe('NETC_FASTAG');
      expect(eway.providerName).toBe('NIC_EWAY_BILL');
      expect(gst.providerName).toBe('GSTN_EINVOICE');

      const resEway = await eway.sync(
        'comp_1',
        { username: 'u', password: 'p' },
        'EWAY_BILL',
        {},
      );
      expect((resEway as any).status).toBe('GENERATED');
    });

    it('SMS, Email, WhatsApp, and Payment gateways should pass configuration checks', () => {
      const sms = new SmsGatewayConnector();
      const email = new EmailGatewayConnector();
      const wa = new WhatsAppConnector();
      const pay = new PaymentGatewayConnector();

      expect(
        sms.validateConfiguration({
          apiKey: 'k',
          senderId: 's',
          provider: 'TWILIO',
        }),
      ).toBe(true);
      expect(
        email.validateConfiguration({
          apiKey: 'k',
          fromEmail: 'no-reply@parilink.com',
        }),
      ).toBe(true);
      expect(
        wa.validateConfiguration({
          phoneNumberId: 'p',
          accessToken: 't',
          businessAccountId: 'b',
        }),
      ).toBe(true);
      expect(
        pay.validateConfiguration({
          keyId: 'k',
          keySecret: 's',
          provider: 'RAZORPAY',
        }),
      ).toBe(true);
    });
  });
});
