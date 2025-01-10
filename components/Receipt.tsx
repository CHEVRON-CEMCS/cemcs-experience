import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'

interface OrderItem {
  id: string
  product_name: string
  price: number
  quantity: number
}

interface OrderData {
  id: string
  customer_email: string
  payment_status: string
  items: OrderItem[]
  subtotal: number
  shipping_fee: number
  total_amount: number
  payment_method: string
}

const formatCurrency = (amount: number) => {
  return `NGN ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const Receipt = ({ order }: { order: OrderData }) => {
  const styles = StyleSheet.create({
    page: {
      padding: 40,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff'
    },
    header: {
      marginBottom: 30,
      borderBottom: '2 solid #eee',
      paddingBottom: 20
    },
    companyName: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 5,
      color: '#1a1a1a',
      textAlign: 'center'
    },
    companyDetails: {
      fontSize: 10,
      color: '#666666',
      textAlign: 'center',
      marginBottom: 5
    },
    receiptTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      marginTop: 15,
      color: '#333333',
      textTransform: 'uppercase'
    },
    section: {
      margin: '10 0'
    },
    orderInfo: {
      backgroundColor: '#f8f9fa',
      padding: 15,
      borderRadius: 4,
      marginBottom: 20
    },
    orderInfoRow: {
      flexDirection: 'row',
      marginBottom: 5
    },
    orderInfoLabel: {
      fontSize: 10,
      color: '#666666',
      width: '30%'
    },
    orderInfoValue: {
      fontSize: 10,
      color: '#333333',
      width: '70%'
    },
    tableHeaderContainer: {
      flexDirection: 'row',
      borderBottomColor: '#eeeeee',
      borderBottomWidth: 1,
      paddingBottom: 5,
      marginBottom: 10,
      backgroundColor: '#f8f9fa',
      padding: 8
    },
    tableRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomColor: '#eeeeee',
      borderBottomWidth: 1
    },
    col1: { width: '40%' },
    col2: { width: '20%', textAlign: 'center' },
    col3: { width: '20%', textAlign: 'right' },
    col4: { width: '20%', textAlign: 'right' },
    tableCell: {
      fontSize: 10,
      color: '#333333'
    },
    tableHeaderCell: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#666666'
    },
    summarySection: {
      marginTop: 30,
      borderTopWidth: 1,
      borderTopColor: '#eeeeee',
      paddingTop: 10
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5
    },
    summaryLabel: {
      fontSize: 10,
      color: '#666666'
    },
    summaryValue: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#333333'
    },
    totalRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#333333'
    },
    totalLabel: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333333'
    },
    totalValue: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#333333'
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 0,
      right: 0,
      textAlign: 'center',
      color: '#666666',
      fontSize: 10,
      paddingHorizontal: 40
    },
    statusBadge: {
      padding: '4 8',
      borderRadius: 4,
      fontSize: 10,
      backgroundColor: '#e6f4ea',
      color: '#1e7e34',
      alignSelf: 'flex-start'
    }
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.companyName}>CEMCS LIMITED</Text>
          <Text style={styles.companyDetails}>Udeco Medical Road, Chevron Drive</Text>
          <Text style={styles.companyDetails}>Chevy View Estate, Lagos</Text>
          <Text style={styles.companyDetails}>cemcsecommerce@chevron.com | +234 (0) 817-236-2732 | 68162</Text>
          <Text style={styles.receiptTitle}>Purchase Receipt</Text>
        </View>

        <View style={styles.orderInfo}>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Receipt Number:</Text>
            <Text style={styles.orderInfoValue}>{order.id}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Date:</Text>
            <Text style={styles.orderInfoValue}>
              {new Date().toLocaleDateString('en-NG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Customer Email:</Text>
            <Text style={styles.orderInfoValue}>{order.customer_email}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Payment Method:</Text>
            <Text style={styles.orderInfoValue}>{order.payment_method}</Text>
          </View>
          <View style={styles.orderInfoRow}>
            <Text style={styles.orderInfoLabel}>Status:</Text>
            <Text style={styles.statusBadge}>{order.payment_status}</Text>
          </View>
        </View>

        <View style={styles.tableHeaderContainer}>
          <Text style={[styles.tableHeaderCell, styles.col1]}>Item Description</Text>
          <Text style={[styles.tableHeaderCell, styles.col2]}>Qty</Text>
          <Text style={[styles.tableHeaderCell, styles.col3]}>Unit Price</Text>
          <Text style={[styles.tableHeaderCell, styles.col4]}>Amount</Text>
        </View>

        {order.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.col1]}>{item.product_name}</Text>
            <Text style={[styles.tableCell, styles.col2]}>{item.quantity}</Text>
            <Text style={[styles.tableCell, styles.col3]}>{formatCurrency(item.price)}</Text>
            <Text style={[styles.tableCell, styles.col4]}>
              {formatCurrency(item.price * item.quantity)}
            </Text>
          </View>
        ))}

        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.subtotal)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Transaction Fee</Text>
            <Text style={styles.summaryValue}>{formatCurrency(order.shipping_fee)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>{formatCurrency(order.total_amount)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={{ marginBottom: 5 }}>Thank you for shopping with CEMCS Limited</Text>
          <Text style={{ fontSize: 9, color: '#999999' }}>
            This is a computer-generated document. No signature is required.
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default Receipt;