PROFILE=$1  # profile for target instance
REGION=$2
STACK_NAME=$3



outputs=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --output json --query 'Stacks[0].Outputs')
echo $outputs > './outputs.json'
echo $outputs

distributionid=$( cat ./outputs.json | jq -r 'map(select(.OutputKey == "CognitoDistributionId"))[0] | "\(.OutputValue)"' )
hostBucket=$( cat ./outputs.json | jq -r 'map(select(.OutputKey == "HostBucket"))[0] | "\(.OutputValue)"' )
echo "DistributionID - ${distributionid}"
echo "Host Bucket - ${hostBucket}"

aws s3 sync ../frontend/dist s3://${hostBucket} --delete --profile $PROFILE --region $REGION
aws cloudfront create-invalidation --distribution-id ${distributionid} --paths / --profile $PROFILE --region $REGION
