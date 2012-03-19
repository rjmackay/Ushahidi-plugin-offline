/*
 * View objects
 */

Backbone.View.prototype.close = function(){
  this.remove();
  this.unbind();
  if (this.onClose){
    this.onClose();
  }
}

/*
 * Report
 */
var ReportView = Backbone.View.extend(
{
	initialize : function(args) {
	},
	render : function() {
		var context = _.extend(this.model.toJSON(),
		{
			cid : this.model.cid,
			incident_date : this.model.incident_date(),
			categories : this.model.categories()
		});
		this.$el.html(this.template(context));
		return this;
	},
	remove : function() {
		$(this.el).remove();
	}
});
var ReportLIView = ReportView.extend(
{
	tagName : 'tr',
	template : _.template($("#report-li-template").html())
});
var ReportPageView = ReportView.extend(
{
	template : _.template($("#report-page-template").html())
});

/*
 *  Report list view
 */
var ReportAppView = Backbone.View.extend(
{
	template : _.template($("#app-template").html()),
	initialize : function() {
		_.bindAll(this, "addReport", "removeReport", "addAll");
		this.model.reports.bind('add', this.addReport);
		this.model.reports.bind('remove', this.removeReport);
		this.model.reports.bind('reset', this.addAll);
	},
	render : function() {
		this.$el.html(this.template(this.model.toJSON()));
		this.reportList = this.$('#reportList');
		if (this.model.reports.length > 0)
			this.addAll();
		return this;
	},
	addReport : function(report) {
		var view = new ReportLIView(
		{
			model : report,
			id : 'report-' + report.cid
		});
		this.reportList.append(view.render().el);
	},
	removeReport : function(report) {
		this.$('#report_' + report.cid).remove();
	},
	addAll : function() {
		this.model.reports.each(this.addReport);
	},
	onClose : function() {
		this.model.reports.unbind('add', this.addReport);
		this.model.reports.unbind('remove', this.removeReport);
		this.model.reports.unbind('reset', this.addAll);
	}
});
