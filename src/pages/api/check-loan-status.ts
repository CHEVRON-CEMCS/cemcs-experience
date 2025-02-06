import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

interface Schedule {
  payment_date: string;
  principal_amount: number;
  interest_amount: number;
  total_payment: number;
  balance_loan_amount: number;
  is_accrued: number;
}

interface LoanInfo {
  name: string;
  repayment_periods: number;
  disbursed_amount: number;
  total_principal_paid: number;
  status: string;
  repaymentsLeft: number;
  schedule: Schedule[];
}

interface LoanInfo {
  name: string;
  repayment_periods: number;
  disbursed_amount: number;
  total_principal_paid: number;
  status: string;
  repaymentsLeft: number;
  schedule: Schedule[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "invalid method" });
  }

  try {
    const response = await axios({
      method: "post",
      url: "https://retiree.chevroncemcs.com/api/method/member_experience.api.ecommerce.fetch_cpay_loan",
      auth: {
        username: "f9d35ccd9be34cf",
        password: "33e93cc3ed4e4e0",
      },
      data: req.body,
    });

    console.log(response.data.message);

    const loans = response.data.message.LoanInfo;

    const filteredLoans = loans.filter(
      (loan: LoanInfo) => loan?.status === "Awaiting Internal Control Approval"
    );

    if (filteredLoans) {
      console.log({
        message: true,
        filteredLoans,
      });
    }

    return res.status(200).json({
      status: true,
      filteredLoans,
    });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).json({
      message: "error fetching loans",
    });
  }
}

// {"message":{"hasLoan":true,"LoanInfo":[{"name":"MEM-LOAP-2025-000039","repayment_periods":1,"disbursed_amount":0.0,"total_principal_paid":0.0,"status":"Loan Approved","repaymentsLeft":1,"schedule":[{"payment_date":"2025-02-15","principal_amount":53300.0,"interest_amount":0.0,"total_payment":53300.0,"balance_loan_amount":0.0,"is_accrued":0}]},{"name":"MEM-LOAP-2025-000038","repayment_periods":2,"disbursed_amount":0.0,"total_principal_paid":0.0,"status":"Awaiting Internal Control Approval","repaymentsLeft":2,"schedule":[{"payment_date":"2025-02-15","principal_amount":28500.0,"interest_amount":0.0,"total_payment":28500.0,"balance_loan_amount":28500.0,"is_accrued":0},{"payment_date":"2025-03-15","principal_amount":28500.0,"interest_amount":0.0,"total_payment":28500.0,"balance_loan_amount":0.0,"is_accrued":0}]},{"name":"MEM-LOAP-2025-000041","repayment_periods":6,"disbursed_amount":0.0,"total_principal_paid":0.0,"status":"Awaiting Internal Control Approval","repaymentsLeft":6,"schedule":[{"payment_date":"2025-02-15","principal_amount":330801.833333333,"interest_amount":0.0,"total_payment":330801.833333333,"balance_loan_amount":1654009.166666667,"is_accrued":0},{"payment_date":"2025-03-15","principal_amount":330801.833333333,"interest_amount":0.0,"total_payment":330801.833333333,"balance_loan_amount":1323207.333333334,"is_accrued":0},{"payment_date":"2025-04-15","principal_amount":330801.833333333,"interest_amount":10751.059583333,"total_payment":341552.892916667,"balance_loan_amount":992405.5,"is_accrued":0},{"payment_date":"2025-05-15","principal_amount":330801.833333333,"interest_amount":10751.059583333,"total_payment":341552.892916667,"balance_loan_amount":661603.666666667,"is_accrued":0},{"payment_date":"2025-06-15","principal_amount":330801.833333333,"interest_amount":10751.059583333,"total_payment":341552.892916667,"balance_loan_amount":330801.833333334,"is_accrued":0},{"payment_date":"2025-07-15","principal_amount":330801.83,"interest_amount":53755.3,"total_payment":384557.13,"balance_loan_amount":0.0,"is_accrued":0}]}]}}
