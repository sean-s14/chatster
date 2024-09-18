pipeline {
    agent { label 'chatster-node' }

    stages {
        stage('Checkout') {
            steps {
                git(
                    url: "${env.GIT_URL}",
                    branch: 'feature'
                )
            }
        }

        stage('Build and Start Dev Containers') {
            steps {
                script {
                    bat 'docker-compose --version'
                    bat "docker-compose -f docker-compose.yaml -f docker-compose.dev.yaml -f docker-compose.dev.test.yaml up -d --build"
                }
            }
        }

        stage('Run Tests for Dev Containers') {
            steps {
                script {
                    dir('./server') {
                        bat "docker exec chatster-server npm run test"
                    }
                    dir('./client') {
                        bat 'docker exec chatster-client npm run test:run'
                        bat 'docker exec chatster-client npm run cy:run'
                    }
                }
            }
        }

        stage('Tear Down Dev Containers') {
            steps {
                script {
                    bat "docker-compose down -v"
                }
            }
        }
    }

    post {
        always {
            script {
                bat "docker-compose down -v --remove-orphans"
            }
        }
    }
}