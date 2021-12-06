pipeline {
  environment {
    registry = "olayori/jump_api"
    registryCredential = '38dfd1a1-4f5b-40cb-b37b-d47dec0c8ef2'
    dockerImage = ''
  }
  agent any

  tools {nodejs "node"}

  stages {
    stage('Git Checkout') {
      steps {
        git credentialsId: 'github-token', url: 'https://github.com/olayori/jump_pipeline.git'
      }
    }
    stage('Test') {
      steps {
        sh 'npm install'
        sh 'npm test'
      }
    }
    stage('Building image') {
      steps{
        script {
          dockerImage = docker.build registry + ":$BUILD_NUMBER"
        }
      }
    }
    stage('Push Image to DockerHub') {
      steps{
        script {
          docker.withRegistry( '', registryCredential ) {
            dockerImage.push()
            dockerImage.push('latest')
          }
        }
      }
    }
    stage('Cleaning up') {
      steps{
        sh "docker rmi $registry:$BUILD_NUMBER"
      }
    }
    stage('Deploy Image to ECS') {
      steps{
        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', credentialsId: "AWS_CREDS", accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
        ]]) {
          sh "ecs deploy --image jumpcloud_api_container docker.io/olayori/jump_api:latest JumpCloud-ECS-Cluster jumpcloud-api --region us-east-1 --access-key-id $AWS_ACCESS_KEY_ID --secret-access-key $AWS_SECRET_ACCESS_KEY  --rollback --timeout 900"
        }
      }
    }    
  }
}
