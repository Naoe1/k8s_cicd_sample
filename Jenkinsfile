def podLabel = "build-${UUID.randomUUID().toString().take(8)}"
podTemplate(
  label: podLabel,
  namespace: 'devops-tools',
  serviceAccount: 'jenkins-admin',
  containers: [
    containerTemplate(
      name: 'jnlp',
      image: 'jenkins/inbound-agent:latest',
      alwaysPullImage: false
    ),
    containerTemplate(
      name: 'node',
      image: 'node:20-alpine',
      command: 'sleep',
      args: '99d',
      resourceRequestCpu: '200m',
      resourceRequestMemory: '256Mi',
      resourceLimitCpu: '500m',
      resourceLimitMemory: '512Mi'
    ),
    containerTemplate(
      name: 'dind',
      image: 'docker:24-dind',
      privileged: true,
      command: 'dockerd-entrypoint.sh',
      args: '--host=tcp://127.0.0.1:2375 --host=unix:///var/run/docker.sock',
      envVars: [
        envVar(key: 'DOCKER_TLS_CERTDIR', value: '')
      ],
      resourceRequestCpu: '300m',
      resourceRequestMemory: '512Mi'
    ),
    containerTemplate(
      name: 'kubectl',
      image: 'bitnami/kubectl:latest',
      command: 'sleep',
      args: '99d'
    ),
  ],
  volumes: [
    emptyDirVolume(mountPath: '/var/lib/docker', memory: false)
  ]
) {
  node(podLabel) {
    env.CLIENT_DIR = 'client/Calculator'
    env.SERVER_DIR = 'server'
    env.DOCKERHUB_NAMESPACE = env.DOCKERHUB_NAMESPACE ?: 'zlhu3'
    env.IMAGE_TAG = env.BUILD_NUMBER ?: 'latest'
    env.DOCKERHUB_CREDENTIALS_ID = env.DOCKERHUB_CREDENTIALS_ID ?: 'dockerhub-creds'

    stage('Checkout') {
      checkout scm
    }

    stage('Build Docker Images') {
      container('dind') {
        sh '''
          set -eux
          export DOCKER_HOST=tcp://127.0.0.1:2375
          docker version

          docker build -t "$DOCKERHUB_NAMESPACE/calculator-client:$IMAGE_TAG" ./client/Calculator
          docker build -t "$DOCKERHUB_NAMESPACE/calculator-server:$IMAGE_TAG" ./server

          docker images | grep "$DOCKERHUB_NAMESPACE/calculator" || true
        '''
      }
    }

    stage('Install Dependencies') {
      container('node') {
        sh '''
          set -eux
          cd "$SERVER_DIR"
          npm ci
          cd "$WORKSPACE/$CLIENT_DIR"
          npm ci
        '''
      }
    }

    stage('Test') {
      /*
      parallel(
        'Server Tests': {
          container('node') {
            sh '''
              set -eux
              cd "$SERVER_DIR"
              npm test -- --ci --coverage
            '''
          }
        },
        'Client Tests': {
          container('node') {
            sh '''
              set -eux
              apk add --no-cache chromium
              export CHROME_BIN=$(command -v chromium || command -v chromium-browser)
              cd "$CLIENT_DIR"
              npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
            '''
          }
        }
      )
      */

      container('node') {
        sh '''
          set -eux
          cd "$SERVER_DIR"
          npm test -- --ci --coverage
        '''

        sh '''
          set -eux
          apk add --no-cache chromium
          export CHROME_BIN=$(command -v chromium || command -v chromium-browser)
          cd "$CLIENT_DIR"
          npm test -- --watch=false --browsers=ChromeHeadless --code-coverage
        '''
      }
    }

    stage('Push Docker Images') {
      container('dind') {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh '''
            set -eux
            export DOCKER_HOST=tcp://127.0.0.1:2375
            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin

            docker push "$DOCKERHUB_NAMESPACE/calculator-client:$IMAGE_TAG"
            docker push "$DOCKERHUB_NAMESPACE/calculator-server:$IMAGE_TAG"
            docker logout
          '''
        }
      }
    }

    stage('Deploy to Kubernetes') {
      container('kubectl') {
        sh '''
          set -eux
          if [ -d k8s/client ] && [ "$(ls -A k8s/client)" ]; then
            kubectl apply -f k8s/client
          else
            echo "Skipping deploy: no manifests found in k8s/client"
          fi
        '''
      }
    }
  }
}
