/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const express = require("express")

exports.onCreateDevServer = ({ app }) => {
  app.use(express.static("public"))
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allSanityService {
        edges {
          node {
            id
            slug {
              current
            }
          }
          next {
            slug {
              current
            }
          }
        }
      }

      allSanityCaseStudy {
        edges {
          node {
            id
            slug {
              current
            }
          }
        }
      }

      allSanityCampaign {
        edges {
          node {
            id
            slug {
              current
            }
          }
        }
      }

      allHubspotPost {
        nodes {
          id
          slug
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const campaigns = result.data.allSanityCampaign.edges || []
  const caseStudies = result.data.allSanityCaseStudy.edges || []
  const serviceEdges = result.data.allSanityService.edges || []
  const posts = result.data.allHubspotPost.nodes || []

  campaigns.forEach((edge, index) => {
    const path = `/${edge.node.slug.current}`

    createPage({
      path,
      component: require.resolve("./src/templates/campaignTemplate.js"),
      context: {
        slug: edge.node.slug.current,
        id: edge.node.id,
      },
    })
  })

  caseStudies.forEach((edge, index) => {
    const path = `/work/${edge.node.slug.current}`

    createPage({
      path,
      component: require.resolve("./src/templates/caseStudyTemplate.js"),
      context: {
        slug: edge.node.slug.current,
        id: edge.node.id,
      },
    })
  })

  serviceEdges.forEach((edge, index) => {
    const path = `/services/${edge.node.slug.current}`

    const nextSlug = edge.next
      ? edge.next.slug.current
      : serviceEdges[0].node.slug.current

    createPage({
      path,
      component: require.resolve("./src/templates/serviceTemplate.js"),
      context: {
        slug: edge.node.slug.current,
        id: edge.node.id,
        nextSlug,
      },
    })
  })

  posts.forEach((post, index) => {
    const path = `/blog/${post.slug}`

    createPage({
      path,
      component: require.resolve("./src/templates/post.js"),
      context: {
        slug: post.slug,
        id: post.id,
      },
    })
  })
}
