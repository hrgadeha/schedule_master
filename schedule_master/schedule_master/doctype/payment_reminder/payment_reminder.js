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
  party_customer: function(frm) {
	cur_frm.refresh();
	cur_frm.clear_table("payment_reminder_table");
	cur_frm.refresh_fields();
	
	if(frm.doc.party_customer){
	
    frappe.call({
    "method": "schedule_master.schedule_master.doctype.payment_reminder.payment_reminder.getSalesInvoice",
args: {
doctype: "Payment Reminder",
customer: frm.doc.party_customer
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row = frm.add_child("payment_reminder_table");
		row.invoice = r.message[i][0];
		row.date = r.message[i][1];
		row.status = r.message[i][2];
		row.outstanding_amount = r.message[i][3];
	}
		cur_frm.refresh();
	}
    });
}
}
});

frappe.ui.form.on("Payment Reminder", {
  party_supplier: function(frm) {
	cur_frm.refresh();
	cur_frm.clear_table("purchase_payment_reminder");
	cur_frm.refresh_fields();

	if(frm.doc.party_supplier){

    frappe.call({
    "method": "schedule_master.schedule_master.doctype.payment_reminder.payment_reminder.getPurchaseInvoice",
args: {
doctype: "Payment Reminder",
supplier: frm.doc.party_supplier
},
callback:function(r){
	var len=r.message.length;
	for (var i=0;i<len;i++){
	        var row = frm.add_child("purchase_payment_reminder");
		row.invoice = r.message[i][0];
		row.date = r.message[i][1];
		row.status = r.message[i][2];
		row.outstanding_amount = r.message[i][3];
	}
		cur_frm.refresh();
	}
    });
}
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
