mandrill-redirect
=================

Redirect emails declared in [Mandrill template](https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template) data to a single developer's/QA's email. Useful during development and testing.

E.g. Given two recipients jack@gmail.com, jill@gmail.com and a redirect email of test@gmail.com
the resulting recipients will be test+0@gmail.com and test+1@gmail.com.


##Use

Install via <code>npm install mandrill-redirect</code>

and use:

<pre>
<code>
    var redirect = require('mandrill-redirect');
    redirect(template, "test@gmail.com"); // Returns true/false
</code>
</pre>

rewrites a Mandrill template:

<pre>
<code>
    {
        message:{
            to: ["jack@gmail.com", "jill@gmail.com"],
            merge_vars: [
                {
                    rcpt: "jack@gmail.com",
                    vars: [...]
                },
                {
                    rcpt: "jill@gmail.com",
                    vars: [...]
                }
            ],
            recipient_metadata:[
                {
                    "rcpt": "jack@gmail.com",
                    "values": [...]
                },
                {
                    "rcpt": "jill@gmail.com",
                    "values": [...]
                }
            ]
        }
    }
</code>
</pre>


to:

<pre>
<code>
    {
        message: {
            to: ["redirect+0@gmail.com", "redirect+1@gmail.com"],
            merge_vars: [
                {
                    rcpt: "redirect+0@gmail.com",
                    vars: [...]
                },
                {
                    rcpt: "redirect+1@gmail.com",
                    vars: [...]
                }
            ],
            recipient_metadata:[
                {
                    "rcpt": "redirect+0@gmail.com",
                    "values": [...]
                },
                {
                    "rcpt": "redirect+1@gmail.com",
                    "values": [...]
                }
            ]
        }
    }
</code>
</pre>


Also:

* **to** is mandatory and must have length
* **merge_vars** is optional but if provided must match the length of **to**
* **recipient_metadata** is optional but if provided must match the length of **to**
* If no email is given for redirecting then any template manipulation is skipped.
* The return value is true/false indicating success/failure. The template is rewritten in place.