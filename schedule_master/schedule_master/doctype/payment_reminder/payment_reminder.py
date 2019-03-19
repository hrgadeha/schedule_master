# -*- coding: utf-8 -*-
# Copyright (c) 2019, Hardik Gadesha and contributors
# For license information, please see license.txt

from __future__ import unicode_literals
import frappe
from frappe.model.document import Document

class PaymentReminder(Document):
	pass

@frappe.whitelist(allow_guest=True)
def getSalesInvoice(doctype, customer):
	query="select name,due_date,status,outstanding_amount from `tabSales Invoice` where status = 'Overdue' and customer = '"+str(customer)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		name,due_date,status,outstanding_amount=i['name'],i['due_date'],i['status'],i['outstanding_amount']
		li.append([name,due_date,status,outstanding_amount])
	return li

@frappe.whitelist(allow_guest=True)
def getPurchaseInvoice(doctype, supplier):
	query="select name,due_date,status,outstanding_amount from `tabPurchase Invoice` where status = 'Overdue' and supplier = '"+str(supplier)+"';"
	li=[]
	dic=frappe.db.sql(query, as_dict=True)
	for i in dic:	
		name,due_date,status,outstanding_amount=i['name'],i['due_date'],i['status'],i['outstanding_amount']
		li.append([name,due_date,status,outstanding_amount])
	return li
