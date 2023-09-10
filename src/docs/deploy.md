# Publishing with Amazon S3 and CloudFront

## Prereqs

- A registered domain name (Route 53 or not)

- AWS CLI

## Why S3 and CloudFront?

Amazon provides built-in static site hosting in S3 buckets that is fairly trivial to set up. It's also free up to a pretty high minimum usage. Unless your site gets slammed, odds are you won't have to pay for it.

The one downside to it is that it doesn't support SSL (HTTPS). This is actually a huge problem because, by default, browsers will not serve you non-HTTPS content anymore without you explicitly denoting it in the address, which most people never do.

However, they do offer HTTPS through their CDN which is called Cloudfront. Again, very cheap if not free up to a large minimum usage.


## Setting up S3

TL;DR of [Hosting a static website using Amazon S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

1. Create your bucket and name it. The address of the website is a good name. (e.g. `mycoolsite.com`)

2. Go to S3 console page for the bucket and follow directions [here](https://docs.aws.amazon.com/AmazonS3/latest/userguide/EnableWebsiteHosting.html).

## Getting a cert

You'll need to obtain a cert to serve HTTPS traffic through Cloudfront. This isn't as difficult as you might think it is.

1. At top of AWS Console home, go to top right and click on the location dropdown. It should show a lot options for AWS cluster locations. Choose US East 1. 

    > Note: If you're not familiar with the paradigm that AWS establishes, it's that when you use a service in their console, the location of where that service is configured for is set by this dropdown. You have to use US East 1 for setting up your certificate. Security certificates only propagate out from US East 1.

1. Go to AWS Certification Manager. 

1. Go to "Request a certificate", then "Request a public certificate"

1. Add your FQDN (Fully-qualified domain name), which is `www.yoursite.com`. There is an option to add more FQDNs, and if you are planning to use `yoursite.com` (with no subdomain), you should add that as well.

1. Then, validate via email or DNS. Email is simpler, but DNS is faster. You're essentially validating that you do, in fact, own the address you're getting a cert for.

    > Note: with DNS verification, you'll be asked to add a couple of CNAME values to your domain's records. If you don't know what that means, or can't, just choose email validation.

1. Click "Request". Depending on how you've decided to verify, you'll proceed in that respective fashion.

## Setting up CloudFront

1. In the CloudFront console, choose "Create Distribution".

1. Choose your domain from your S3 bucket in the dropdown. It will note that you should use the website endpoint for the bucket if you have that bucket in static site serving mode.

1. For "Cache behavior" section, leave defaults, except for:
    - Redirect HTTP to HTTPS

1. Under "Settings" section, leave all default, except:
    - Under "Custom SSL Certificate", choose the cert you made above.

## Create config files

1. At the root of this package, run this script, replacing the `<S3 BUCKET NAME>` portion with your S3 bucket name:

    ```
    touch .s3 && echo "s3://<S3 BUCKET NAME>/" > .s3
    ```

1. Again, in the root of this package, run this script as well, replacing `<CLOUDFRONT DISTRIBUTION ID>` with your CloudFront distribution ID:

    ```
    touch .cloudfront && echo "<CLOUDFRONT DISTRIBUTION ID>" > .cloudfront
    ```

## Create account in IAM for AWS CLI access

1. Go to IAM console, and go to Users page.

1. Click "Add Users"

1. Write in a user name. Go to next step.

1. Click "Attach policies directly" and then select "AdministratorAccess" in the options below. Click next.

    > Note: This is normally considered poor practice, but if it's just you, it's kind of overkill to create a rigorous permissions policy.

1. Click "Create user"

## Configure AWS CLI with Access keys

Once your user is created, you'll need to obtain an access key ID and secret access key.

1. Go to user's profile page, and click on "Security credentials" tab.

1. Under the "Access keys" section, click on "Create access key".

1. Choose the CLI use case.

1. Enter in description (if you want) and click "Create Access Key"

1. It will then bring you to a page that will show you the keys. They will only be shown this once, so be sure you copy them both somewhere before you navigate away.

1. Open your terminal and run 

    ```
    aws configure
    ```

1. Enter your Access Key ID, press enter.

1. Enter your Secret Access Key and press enter.

Now, you should be able to run `yarn deploy` to deploy your website to the world.