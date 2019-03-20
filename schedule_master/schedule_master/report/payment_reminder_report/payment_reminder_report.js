// Copyright (c) 2016, Hardik Gadesha and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Payment Reminder Report"] = {
	"filters": [
		{
			"fieldname":"party_type",
			"label": __("Party Type"),
			"fieldtype": "Select",
			"options": "Supplier\nCustomer",
			on_change: function() {
				frappe.query_report.set_filter_value('party', "");
			}
		},
		{
			"fieldname":"party",
			"label": __("Party"),
			"fieldtype": "MultiSelect",
			get_data: function() {
				if (!frappe.query_report.filters) return;
				var party_type = frappe.query_report.get_filter_value('party_type');
				var parties = frappe.query_report.get_filter_value('party');
				if(!party_type) return;

				const values = parties.split(/\s*,\s*/).filter(d => d);
				const txt = parties.match(/[^,\s*]*$/)[0] || '';
				let data = [];

				frappe.call({
					type: "GET",
					method:'frappe.desk.search.search_link',
					async: false,
					no_spinner: true,
					args: {
						doctype: frappe.query_report.get_filter_value('party_type'),
						txt: txt,
						filters: {
							"name": ["not in", values]
						}
					},
					callback: function(r) {
						data = r.results;
					}
				});
				return data;
			}
}
]
}
