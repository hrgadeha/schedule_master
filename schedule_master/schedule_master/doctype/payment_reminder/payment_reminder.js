// Copyright (c) 2019, Hardik Gadesha and contributors
// For license information, please see license.txt

frappe.ui.form.on('Payment Reminder', {
	refresh: function(frm) {

	}
});

cur_frm.add_fetch('next_follow_up_by', 'mobile_no', 'contact_number')

frappe.ui.form.on('Payment Reminder', {
	"party_type": function(frm) {
		cur_frm.refresh();
		frm.set_value("party","");
		cur_frm.clear_table("payment_reminder_table");
		cur_frm.clear_table("purchase_payment_reminder");
		cur_frm.refresh_fields();
		if (frm.doc.party_type == 'Customer'){
			frm.set_value("reminder_for","Sales Invoice");
		}
		else{
			frm.set_value("reminder_for","Purchase Invoice");
		}
	}
});

frappe.ui.form.on("Payment Reminder", {
  get_details: function(frm) {
	cur_frm.refresh();
	cur_frm.clear_table("payment_reminder_table");
	cur_frm.refresh_fields();
	var total = 0
	
	if(frm.doc.party_type == 'Customer'){
	
    frappe.call({
    "method": "schedule_master.schedule_master.doctype.payment_reminder.payment_reminder.getOverdueInvoiceSI",
args: {
doctype: "Payment Reminder",
party: frm.doc.party
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row = frm.add_child("payment_reminder_table");
		row.invoice = r.message[i][0];
		row.date = r.message[i][1];
		row.status = r.message[i][2];
		row.outstanding_amount = r.message[i][3];
		total = total + r.message[i][3];
	}
		cur_frm.refresh();
		frm.set_value("total_outstanding_amount", total);
	}
    });
}

	if(frm.doc.party_type == 'Supplier'){
	
    frappe.call({
    "method": "schedule_master.schedule_master.doctype.payment_reminder.payment_reminder.getOverdueInvoicePI",
args: {
doctype: "Payment Reminder",
party: frm.doc.party
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row_1 = frm.add_child("payment_reminder_table");
		row_1.invoice = r.message[i][0];
		row_1.date = r.message[i][1];
		row_1.status = r.message[i][2];
		row_1.outstanding_amount = r.message[i][3];
		total = total + r.message[i][3];
	}
		cur_frm.refresh();
		frm.set_value("total_outstanding_amount", total);
	}
    });
}

	 frappe.call({
    "method": "schedule_master.schedule_master.doctype.payment_reminder.payment_reminder.getContactDetails",
args: {
doctype: "Payment Reminder",
party: frm.doc.party
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row_1 = frm.add_child("contact_table");
		row_1.name1 = r.message[i][0];
		row_1.department = r.message[i][1];
		row_1.designation = r.message[i][2];
		row_1.number = r.message[i][3];
	}
		cur_frm.refresh();
	}
    });
}
});

frappe.ui.form.on('Payment Reminder', 'send_sms', function(frm){
	var date = frm.doc.next_reminder_date;
	var p = date.split(/\D/g)
	var new_date = [p[2],p[1],p[0] ].join("-")
  	var message = frm.doc.follow_up_by + ' Assign You Payment Follow Up ' + frm.doc.name + ' On Date : ' + new_date;

console.log(message);
  frappe.call({
    method: "frappe.core.doctype.sms_settings.sms_settings.send_sms",
    args: {
      receiver_list: [frm.doc.contact_number],
      msg: message,
    },
    callback: function(r) {
      if(r.exc) {msgprint(r.exc); return;}
    }
  });
})
