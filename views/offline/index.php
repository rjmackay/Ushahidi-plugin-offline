<!DOCTYPE html>
<!--<html manifest="./index.appcache">-->
<html>

  <head>

    <title>Ushahidi Report Tool</title>
    <link rel="stylesheet" href="/plugins/offline/css/jquery.mobile-1.0a3.min.css" />
    <link rel="stylesheet" href="/plugins/offline/css/interview.css" />
    <link rel="stylesheet" href="/plugins/offline/css/font.css" />

    <!-- geo location -->
    <script src="http://code.google.com/apis/gears/gears_init.js" type="text/javascript" charset="utf-8"></script>
    <script src="/plugins/offline/js/geo.js" type="text/javascript" charset="utf-8"></script>
    <!-- -->

    <script src="/plugins/offline/js/jquery-1.7.1.min.js"></script>
    
    <script src="/plugins/offline/js/realStorage-2.0.1-min.js"></script>
<!--
    <script src="/plugins/offline/js/gears_init.js"></script>
    <script src="/plugins/offline/js/persistence.js"></script>
    <script src="/plugins/offline/js/persistence.store.sql.js"></script>
    <script src="/plugins/offline/js/persistence.store.websql.js"></script>
-->
    <script src="/plugins/offline/js/interview.db.js"></script>
    <script src="/plugins/offline/js/interview.mobile.js"></script>

    <script src="/plugins/offline/js/jquery.mobile-1.0a3.min.js"></script>


	<!-- iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="viewport" content="width=device-width, minimum-scale=0.5, maximum-scale=0.5" />

    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <!-- -->

    <link rel="apple-touch-icon" sizes="72x72" href="/plugins/offline/images/ipad-icon.png" />

  </head>
<body>

<!-- INTRO -->
<div data-role="page" class="page intro" id="index">
    <div data-role="header" data-position="inline">

		<!-- BEGIN .logo -->
		<div class="logo">


		<!-- END .logo -->
		</div>

		<!-- BEGIN #btn-settings -->
		<a href="#settings" class="ui-btn-right">Settings</a>

		<!-- END #btn-settings -->

    </div>

    <div data-role="content">

        <!--<div class="link-external">
          <a href="http://www.ushahidi.org">Ushahidi instance</a>
        </div>-->

        <!-- BEGIN #istance -->
        <div class="istance">

        	<a href="http://car.vm/"><span class="link">Ushahidi CAR</span></a>

        <!-- END #istance -->
        </div>

        <div>
            <a href="#new" data-role="button" class="btn-submit">Submit report</a>
        </div>

        <!--<div class="status"></div>-->


        <div id="interview-list">
            <div data-snippet="interview-item" class="interview-item" style="display:none">
                <a href="#reportview">
                    <h2 class="incident_title">title</h2>
                    <span class="incident_date">01/01/2011</span>
                    <div class="posted">status</div>
                    <div class="interview-item-ct">
                        <!--<div class="incident_category">category</div>-->
                        <div class="interview-item-date">
                            <div class="label">Date : </div>
                            <div class="value">
                                <span class="incident_date">date</span> &mdash; <span class="incident_hour">hour</span>:<span class="incident_minute">minute</span><span class="incident_ampm">pm</span>
                            </div>
                        </div>
                        <div class="interview-item-where">
                            <div class="label">Location : </div>
                            <div class="value">
                                <span class="location_name">Location</span>
                            </div>
                            <div class="value" style="display:block">
                                Lat: <span class="latitude">1.000</span> &mdash; Long:<span class="longitude">1.000</span>
                            </div>
                        </div>
                        <div class="incident_description">description...</div>
                        <div class="incident_photo"></div>
                    </div>
                </a>
            </div>
            <div class="interview-list-toup"></div>
            <div class="upload-btn" style="display:none">
                <a id="sync" href="#" data-role="button" class="ui-btn-right">Upload all</a>
            </div>
            <div class="interview-list-uploaded"></div>
        </div>
    </div>

    <div data-role="footer" class="ui-bar" data-position="fixed">
        <span>total reports <span class="rv-sent">3</span> <span class="unsent">( <span class="rv-unsent">1</span> unsent )</span></span>
    </div>
</div>
<!-- -->


<!-- NEW -->
<div data-role="page" id="new">
    <div data-role="header" data-position="inline">
      <h1 class="section_title">ADD NEW REPORT</h1>
    </div>
    <div data-role="content">
      <div>
       <form method="GET" class="form-interview">
          <div data-role="fieldcontain">
            <label for="incident_title">Title</label>
            <input type="text" name="incident_title" id="incident_title"/>
          </div>
          <div data-role="fieldcontain">
            <label for="incident_description">Description</label>
            <textarea name="incident_description" id="incident_description"></textarea>
          </div>
          <div data-role="fieldcontain">
            <label for="incident_category">Category</label>
            <select name="incident_category" id="incident_category">
                <option value="1">category 1</option>
                <option value="2">category 2</option>
                <option value="3">category 3</option>
            </select>
          </div>
          <div data-role="fieldcontain">
            <label for="location_name">Location</label>
            <input type="text" name="location_name" id="location_name"/>
          </div>

          <div data-role="fieldcontain" class="incident_photo_field">
              <label for="incident_photo">Photo</label>
              <input type="file" name="incident_photo" id="incident_photo" onchange="handlePhotoSelect(this.files)" />
              <div id="incident_photo_preview"></div>
          </div>

          <button type="submit">SEND</button>

        </form>
      </div>
    </div>
</div>
<!-- -->


<!-- UPLOAD -->
<div data-role="page" id="upload">
  <div data-role="content">

    <div>
      <h1>Upload</h1>
      <div class="status"></div>
    </div>

    <a id="sync" href="#" data-role="button" data-theme="c" class="ui-btn-right">Send</a>
    <a href="#index" data-role="button" data-theme="c" class="ui-btn-right">Home</a>

  </div>

</div>
<!-- -->


<!-- SETTINGS -->
<div data-role="page" id="settings">
    <div data-role="header" data-position="inline">
        <h1 class="section_title">Settings</h1>
    </div>

    <div data-role="content">
        <div>
          <div data-role="fieldcontain" class="warningbox">
            <label for="person_first">Warning</label>
            <span class="description">Do not clear the cache if want to use this application offline.</span>
          </div>

          <div data-role="fieldcontain">
            <span class="description big">Leave these fields blank if you want to send anonymous reports:</span>
          </div>

          <form method="GET" class="form-settings">

            <div data-role="fieldcontain">
              <label for="person_first">First name</label>
              <input type="text" name="person_first" id="person_first" />
            </div>

            <div data-role="fieldcontain">
              <label for="person_last">Last name</label>
              <input type="text" name="person_last" id="person_last" />
            </div>

            <div data-role="fieldcontain">
              <label for="person_email">Email</label>
              <input type="text" name="person_email" id="person_email" />
            </div>

            <button type="submit">Save</button>
          </form>
        </div>

        <div>
            <div class="removebox">
              <span class="removelabel">Reset</span>
              <span class="description">will delete all reports both sent and unsent.</span>
            </div>
            <a id="reset" data-role="button" class="ui-btn-right">Reset</a>
        </div>
        <div class="setting-status"></div>
    </div>
</div>
<!-- -->


<!-- REPORTVIEW -->
<div data-role="page" id="reportview">

    <div data-role="header" data-position="inline">
        <h1 class="section_title">Report</h1>
        <!--<a href="#settings" data-icon="gear" class="ui-btn-right">Settings</a>-->
    </div>

    <div data-role="content">

    </div>

</div>
<!-- -->


<!-- STATUS -->
<div data-role="page" id="dbstatus">
  <div data-role="content">
      <div class="status"></div>
  </div>
  <a data-rel="back" data-role="button" data-theme="c" class="ui-btn-right">Close</a>
</div>


<!-- EMPTY -->
<div data-role="page" id="empty">
    <div data-role="header">xx</div>
    <div data-role="content">xx</div>
    <div data-role="footer">xx</div>
</div>

</body>
</html>
