# -*- coding: utf-8 -*-
# Copyright (c) 2019, Hardik Gadesha and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PaymentReminder(Document):
	pass

@frappe.whitelist(allow_guest=True)
def getOverdueInvoiceSI(doctype,party):
	query="select name,due_date,status,outstanding_amount from `tabSales Invoice` where status = 'Overdue' and customer = '"+str(party)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		name,due_date,status,outstanding_amount=i['name'],i['due_date'],i['status'],i['outstanding_amount']
		li.append([name,due_date,status,outstanding_amount])
	return li

@frappe.whitelist(allow_guest=True)
def getOverdueInvoicePI(doctype,party):
	query="select name,due_date,status,outstanding_amount from `tabPurchase Invoice` where status = 'Overdue' and supplier = '"+str(party)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		name,due_date,status,outstanding_amount=i['name'],i['due_date'],i['status'],i['outstanding_amount']
		li.append([name,due_date,status,outstanding_amount])
	return li

@frappe.whitelist(allow_guest=True)
def getContactDetails(doctype,party):
	query="select c.first_name,c.department,c.designation,c.mobile_no from `tabContact` c, `tabDynamic Link` dl where c.name = dl.parent and dl.link_name = '"+str(party)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		first_name,department,designation,mobile_no=i['first_name'],i['department'],i['designation'],i['mobile_no']
		li.append([first_name,department,designation,mobile_no])
	return li
