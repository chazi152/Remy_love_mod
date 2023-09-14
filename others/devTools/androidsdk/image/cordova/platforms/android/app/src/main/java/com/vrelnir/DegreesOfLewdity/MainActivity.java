/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
 */

package com.vrelnir.DegreesOfLewdity;

import android.os.Bundle;
import android.os.SystemClock;
import android.widget.Toast;
import org.apache.cordova.*;

import com.vrelnir.DegreesOfLewdity.R;

public class MainActivity extends CordovaActivity {

    /**
     * Max time in ms between back presses to close the app.
     */
    private static final long MAX_BACK_INTERVAL = 4000L;

    private long lastBackEvent = 0L;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // enable Cordova apps to be started in the background
        Bundle extras = getIntent().getExtras();
        if (extras != null && extras.getBoolean("cdvStartInBackground", false)) {
            moveTaskToBack(true);
        }

        // Set by <content src="index.html" /> in config.xml
        loadUrl(launchUrl);
    }

    @Override
    public void onBackPressed() {
        long now = SystemClock.uptimeMillis();
        if (now - lastBackEvent < MAX_BACK_INTERVAL) {
            // close app only if pressed again within defined period
            super.onBackPressed();
        } else {
            lastBackEvent = now;
            // else show confirm close message
            Toast.makeText(this, R.string.confirm_close, Toast.LENGTH_LONG).show();
        }
    }

}
